import { debouce } from './utils'
import BackTop from "components/content/backtop/BackTop";

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
    }
  },
  mounted() {
    const refresh = debouce(this.$refs.scroll.refresh, 100)
    this.itemImgListener = () => {
      this.$refs.scroll && refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  }
}
export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 300)
    },
    listenerShowBackTop(position){
      this.isShowBackTop = (-position.y) > 1000
    }
  }
}
