const DefaultConfig = {
  test: /\.(jpe?g|png|svg|gif|ico|webp|jp2)$/,
  // Next.js already handles url() in css/sass/scss files
  issuer: /\.\w+(?<!(s?c|sa)ss)$/i,
  name: "[name]-[hash].[ext]",
};

module.exports = (getImagesConfig = (x) => x) => (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      const { isServer } = options;
      nextConfig = Object.assign(
        { inlineImageLimit: 8192, assetPrefix: "" },
        nextConfig
      );

      if (!options.defaultLoaders) {
        throw new Error(
          "This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade"
        );
      }

      const { test, issuer, name } = getImagesConfig(DefaultConfig);

      config.module.rules.push({
        test,
        issuer,
        exclude: nextConfig.exclude,
        use: [
          {
            loader: require.resolve("url-loader"),
            options: {
              limit: nextConfig.inlineImageLimit,
              fallback: require.resolve("file-loader"),
              publicPath: `${nextConfig.assetPrefix}/_next/static/images/`,
              outputPath: `${isServer ? "../" : ""}static/images/`,
              name,
              esModule: nextConfig.esModule || false,
            },
          },
        ],
      });

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};
