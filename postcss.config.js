export default {
  plugins: {
    'postcss-rem-to-pixel': {
      rootValue: 16, // 1rem = 16px（根据你的 Tailwind 基准调整）
      unitPrecision: 6, // 转换后的小数位
      propList: ['*'], // 需要转换的属性，* 表示所有
      replace: true, // 直接替换，不保留 rem
      mediaQuery: false, // 不转换媒体查询中的 rem
      minRemValue: 0, // 小于等于这个值的不转换
     }
  }
}