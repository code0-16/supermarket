<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control  :titles="['流行' , '新款' , '精选']" @tabClick="tabClick" ref="tabControl1" class="tab-control" v-show="isTabFixed"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true" @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/> 
      <feature-view/>
      <tab-control  :titles="['流行' , '新款' , '精选']" @tabClick="tabClick" ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import HomeSwiper from './childcomps/HomeSwiper'
import RecommendView from './childcomps/RecommendView'
import FeatureView from './childcomps/FeatureView'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabcontrol/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'

import {getHomeMultidata , getHomeGoods} from 'network/home'

import {itemListenerMixin , backTopMixin} from 'common/mixin'

export default {
  components: { 
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll
  },
  mixins: [itemListenerMixin , backTopMixin],
  data() {
    return{
      banners: [],
      recommends: [],
      goods:{
        'pop': {page: 0 , list:[]},
        'new': {page: 0 , list:[]},
        'sell': {page: 0 , list:[]}
      },
      currentType: 'pop',
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    }
  },
  computed:{
    showGoods(){
      return this.goods[this.currentType].list
    }
  },
  created(){
    this.getHomeMultidata()
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
    },  
  mounted(){
    // const refresh = debounce(this.$refs.scroll.refresh,100)
    
    //   this.$bus.$on('itemImageLoad' , ()=>{
    //   this.$refs.scroll && this.$refs.scroll.refresh()
    //   })
  },
  activated(){
    this.$refs.scroll.scrollTo(0,this.saveY,0)
    this.$refs.scroll.refresh()
  },
  deactivated(){
    this.saveY = this.$refs.scroll.getScrollY()
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  },
  methods: {
    //事件监听相关的方法
    tabClick(index){
      switch (index){
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    backClick(){
      this.$refs.scroll.scrollTo(0,0,500)
    },
    contentScroll(position){
      this.isTabFixed = (-position.y) > this.tabOffsetTop
      this.listenerShowBackTop(position)
    },
    loadMore(){
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad(){
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
    
   
    // 网络请求相关的方法
    getHomeMultidata(){
      getHomeMultidata().then(res=>{
      this.banners = res.data.banner.list;
      this.recommends = res.data.recommend.list;
    })
    },
    getHomeGoods(type){
      const page =this.goods[type].page + 1
      getHomeGoods(type,page).then(res=>{
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1
        this.$refs.scroll.finishPullUp()
    }) 
    }
  }
}
</script>

<style scoped>
#home{
  height: 100vh;

  position: relative;
}
.home-nav{
  background-color: var(--color-tint);
  color: #ffffff;
}

.content{
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
.tab-control{
  position: relative;
  z-index: 19;
  background-color: #fff;
}
</style>