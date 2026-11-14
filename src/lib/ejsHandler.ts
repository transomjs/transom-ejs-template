import assert from "assert";
import createDebug from "debug";
import ejs from "ejs";
import fs from "fs";
import path from "path";

const debug = createDebug("transom:template");

// This file runs from <package>/dist/lib.
const PACKAGE_ROOT = path.join(__dirname, "..", "..");

/**
 * Where template folders are resolved from: the application's root, found by walking up
 * out of node_modules/@transomjs/transom-ejs-template. When NODE_ENV is "testing", the
 * package's own test/ folder.
 */
function templateRoot(environment: string): string {
  return environment === "TESTING"
    ? path.join(PACKAGE_ROOT, "test")
    : path.join(PACKAGE_ROOT, "..", "..", "..");
}

/**
 * Builds the renderer that transom-ejs-template registers (as "transomTemplate" by default).
 * A plain function, so existing `new TransomEjsHandler(...)` calls keep working.
 */
function TransomEjsHandler(
  server: TransomEjsHandler.HandlerServer,
  options?: TransomEjsHandler.TemplateOptions,
): TransomEjsHandler.Renderer {
  const handlerOptions: TransomEjsHandler.TemplateOptions = options || {};

  function templateSection(): TransomEjsHandler.TemplateDefinition {
    // Boundary: the API definition's template section.
    return server.registry.get("transom-config.definition.template", {}) as TransomEjsHandler.TemplateDefinition;
  }

  function renderHtmlTemplate(
    templateName: string,
    renderData?: object,
    htmlOptions?: TransomEjsHandler.RenderOptions,
  ): string {
    assert(templateName, "Template name is required.");
    htmlOptions = htmlOptions || {};

    debug("Rendering HTML template", templateName);

    const template = templateSection();
    const opts = Object.assign({}, handlerOptions, htmlOptions);
    const data: TransomEjsHandler.TemplateData = { ...template.data, ...handlerOptions.data, ...renderData };

    data.environment = (process.env.NODE_ENV || "DEVELOPMENT").toUpperCase();
    data.templateName = templateName;

    const templatePath = opts.templatePath || template.htmlTemplatePath || "templateHtml";
    const filename = path.join(templateRoot(data.environment), templatePath, `${templateName}.ejs`);

    if (fs.existsSync(filename)) {
      debug("Loading HTML template", filename);
    } else {
      debug("HTML template not found", filename);
      throw new Error(`HTML template not found: ${filename}`);
    }
    const tmp = fs.readFileSync(filename, "utf8");

    // `filename` as an option makes ejs resolve relative includes. (ejs 7 no longer reads
    // options from the data object; it stays there too, for templates that read it.)
    return ejs.render(tmp, { data, filename }, { filename });
  }

  function renderEmailTemplate(
    templateName: string,
    renderData?: object,
    emailOptions?: TransomEjsHandler.RenderOptions,
  ): string {
    assert(templateName, "Template name is required.");
    emailOptions = emailOptions || {};
    debug("Rendering Email template", templateName);

    const template = templateSection();
    const opts = Object.assign({}, handlerOptions, emailOptions);
    const data: TransomEjsHandler.TemplateData = { ...template.data, ...opts.data, ...renderData };

    data.environment = (process.env.NODE_ENV || "DEVELOPMENT").toUpperCase();
    data.templateName = templateName;

    const templatePath = opts.templatePath || template.emailTemplatePath || "templateEmail";
    const filename = path.join(templateRoot(data.environment), templatePath, `${templateName}.ejs`);

    if (fs.existsSync(filename)) {
      debug("Loading Email template", filename);
    } else {
      debug("Email template not found", filename);
      throw new Error(`Email template not found: ${filename}`);
    }
    const tmp = fs.readFileSync(filename, "utf8");

    // `filename` as an option makes ejs resolve relative includes. (ejs 7 no longer reads
    // options from the data object; it stays there too, for templates that read it.)
    return ejs.render(tmp, { data, filename }, { filename });
  }

  return {
    renderHtmlTemplate,
    renderEmailTemplate,
  };
}

declare namespace TransomEjsHandler {
  /** The parts of the transom-core server the renderer uses. Any transom-core server fits. */
  interface HandlerServer {
    registry: {
      get(key: string, defaultValue: object): unknown;
    };
  }

  /** Per-call options. */
  interface RenderOptions {
    /** Folder under the application root, overriding the configured one. */
    templatePath?: string;
    /** Extra data for email templates. (HTML templates use the plugin-level `data` only.) */
    data?: object;
  }

  /** Plugin options, from transom.configure(). */
  interface TemplateOptions extends RenderOptions {
    /** The registry key for the renderer. Defaults to "transomTemplate". */
    registryKey?: string;
  }

  /** The API definition's `definition.template` section. */
  interface TemplateDefinition {
    /** Data passed to every template. */
    data?: object;
    /** Defaults to "templateHtml". */
    htmlTemplatePath?: string;
    /** Defaults to "templateEmail". */
    emailTemplatePath?: string;
  }

  /**
   * What a template sees as `data`: the configured data and the render data, merged,
   * plus `environment` (NODE_ENV upper-cased, "DEVELOPMENT" if unset) and `templateName`.
   */
  interface TemplateData {
    environment?: string;
    templateName?: string;
    [key: string]: unknown;
  }

  /** The registered renderer. Both methods throw if the template file doesn't exist. */
  interface Renderer {
    /** Renders <templatePath>/<templateName>.ejs from the html template folder. */
    renderHtmlTemplate(templateName: string, renderData?: object, options?: RenderOptions): string;
    /** Renders <templatePath>/<templateName>.ejs from the email template folder. */
    renderEmailTemplate(templateName: string, renderData?: object, options?: RenderOptions): string;
  }
}

export = TransomEjsHandler;
