export default{
     addCart(context, payload){
    // payload新添加的商品
    return new Promise((resolve, reject) => {
      // 查找之前数组中是否有该商品
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      // 判断oldProduct
      if(oldProduct) {
        context.commit('addCounter', oldProduct)
        resolve('当前商品数量+1')
      }else {
        // 当前加入的是新商品,push进来
        context.commit('addToCart', payload)
        resolve('添加了新的商品')
      }
    })
  }
}