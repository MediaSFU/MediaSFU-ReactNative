const fs = require('fs');
const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const projectRoot = __dirname;
const sharedPackageRoot = path.resolve(projectRoot, '../mediasfu-shared');
const sharedPackageSrcRoot = path.resolve(sharedPackageRoot, 'src');
const sharedPackageNodeModules = path.resolve(sharedPackageRoot, 'node_modules');
const sharedPackageEntry = path.resolve(sharedPackageSrcRoot, 'index.ts');
const sharedPackageNativeEntry = path.resolve(sharedPackageSrcRoot, 'index.native.ts');
const projectNodeModules = path.resolve(projectRoot, 'node_modules');

const escapePathForRegex = (value) =>
	value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');

const sharedDistBlockList = [
	path.resolve(sharedPackageRoot, 'dist'),
	path.resolve(projectNodeModules, 'mediasfu-shared', 'dist'),
].map(
	(distPath) => new RegExp(`${escapePathForRegex(distPath)}(?:[\\\\/].*)?$`),
);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
	watchFolders: [sharedPackageSrcRoot, sharedPackageNodeModules].filter((folder) =>
		fs.existsSync(folder),
	),
	resolver: {
		blockList: sharedDistBlockList,
		unstable_enableSymlinks: false,
		extraNodeModules: new Proxy(
			{
				'mediasfu-shared': sharedPackageSrcRoot,
			},
			{
				get(target, name) {
					if (typeof name !== 'string') {
						return target[name];
					}

					return target[name] || path.join(projectNodeModules, name);
				},
			},
		),
		resolveRequest(context, moduleName, platform) {
			if (moduleName === 'mediasfu-shared') {
				const sharedEntry = platform === 'web' ? sharedPackageEntry : sharedPackageNativeEntry;

				return context.resolveRequest(context, sharedEntry, platform);
			}

			return context.resolveRequest(context, moduleName, platform);
		},
		nodeModulesPaths: [
			projectNodeModules,
			sharedPackageNodeModules,
		],
	},
	server: {
		enhanceMiddleware: (middleware) => {
			return (req, res, next) => {
				const requestUrl = req.url || '';
				const isBundleRequest = requestUrl.includes('.bundle');
				const acceptHeader = req.headers?.accept;

				if (isBundleRequest && typeof acceptHeader === 'string' && acceptHeader.includes('multipart/mixed')) {
					const filteredAcceptHeader = acceptHeader
						.split(',')
						.map((value) => value.trim())
						.filter((value) => value && value !== 'multipart/mixed')
						.join(', ');

					if (filteredAcceptHeader) {
						req.headers.accept = filteredAcceptHeader;
					} else {
						delete req.headers.accept;
					}
				}

				return middleware(req, res, next);
			};
		},
	},
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
