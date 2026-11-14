import createDebug from "debug";
import TransomEjsHandler = require("./lib/ejsHandler");

const debug = createDebug("transom:template");

/** The parts of the transom-core server this plugin uses. Any transom-core server fits. */
interface TemplatePluginServer extends TransomEjsHandler.HandlerServer {
  registry: TransomEjsHandler.HandlerServer["registry"] & {
    set(key: string, value: unknown): void;
  };
}

/**
 * Registers an EJS renderer (see TransomEjsHandler) in the registry, as "transomTemplate"
 * unless `registryKey` says otherwise.
 */
class TransomEjsTemplate {
  initialize = (server: TemplatePluginServer, options: TransomEjsHandler.TemplateOptions): void => {
    const regKey = options.registryKey || "transomTemplate";
    debug("Adding TransomEjsHandler to the registry as:", regKey);
    server.registry.set(regKey, TransomEjsHandler(server, options));
  };
}

/** The plugin instance, as `require("@transomjs/transom-ejs-template")` has always returned. */
const transomEjsTemplate = new TransomEjsTemplate();

declare namespace transomEjsTemplate {
  type TemplateOptions = TransomEjsHandler.TemplateOptions;
  type RenderOptions = TransomEjsHandler.RenderOptions;
  type TemplateDefinition = TransomEjsHandler.TemplateDefinition;
  type TemplateData = TransomEjsHandler.TemplateData;
  type Renderer = TransomEjsHandler.Renderer;
  type PluginServer = TemplatePluginServer;
}

export = transomEjsTemplate;
