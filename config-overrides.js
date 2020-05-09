const {override, fixBabelImports} = require('customize-cra');

module.exports = override(
    fixBabelImports('antd', {
        libraryName: 'es',
        style: 'css'
   }),
);