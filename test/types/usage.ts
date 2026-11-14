// Compiled by `npm run typecheck` only: checks the published types the way a consumer uses them.
import transomTemplate = require("../../dist");
import TransomEjsHandler = require("../../lib/ejsHandler");

const store = new Map<string, unknown>();
const server: transomTemplate.PluginServer = {
  registry: {
    get: (key, defaultValue) => store.get(key) ?? defaultValue,
    set: (key, value) => void store.set(key, value),
  },
};
transomTemplate.initialize(server, { registryKey: "templates", templatePath: "views" });

const renderer: transomTemplate.Renderer = TransomEjsHandler(server, {});
const html: string = renderer.renderHtmlTemplate("page", { title: "Hi" }, { templatePath: "html" });
const email: string = renderer.renderEmailTemplate("welcome", { name: "Jo" });

const section: transomTemplate.TemplateDefinition = { data: { site: "x" }, emailTemplatePath: "mail" };

export { html, email, section };
