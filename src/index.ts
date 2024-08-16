import { htmlPlugin } from "./htmlPlugin";
import { rewriteAll } from './rewriteAll';
import { ProxyOptions } from "vite";
import dns from "dns";

if ('setDefaultResultOrder' in dns) {
  dns.setDefaultResultOrder('ipv4first')
}

export interface UrbitPluginConfig extends ProxyOptions {
  /**
   * The base that this app will be served at. This should be the same
   * as the `base` property on the docket file
   */
  base: string;
  /**
   * URL of urbit to proxy requests to
   *
   * @example `"http://localhost:8080"`
   */
  target: string;
}

const UrbitProxyPlugin = ({ base, target, ...options }: UrbitPluginConfig) => {
  const basePath = `/apps/${base}/`;
  return {
    name: "return-partial",
    config: () => ({
      base: basePath,
      server: {
        proxy: {
          [`^${basePath}desk.js`]: {
            target,
            ...options
          },
          [`^((?!${basePath}).)*$`]: {
            target,
            ...options
          },
        },
      },
    }),
  };
};

/**
 * Setup a vite dev server for urbit development
 *
 */
export const urbitPlugin = (config: UrbitPluginConfig) => {
  const htmlPluginOpt = {
    headScripts: [
      { src: "/desk.js" },
      { src: "../../session.js" },
    ],
  };

  return [UrbitProxyPlugin(config), rewriteAll(), htmlPlugin(htmlPluginOpt)];
};
