<template>
  <div class="the-lyrics">
    <p>{{ lyrics }}</p>
  </div>
</template>

<script>
export default {
  name: 'TheLyrics',
  props: {
    lyrics: {
      type: String,
      default: `
        I still see your shadows in my room
        Can't take back the love that I gave you
        It's to the point where I love and I hate you
        And I cannot change you so I must replace you (oh)
        Easier said than done
        I thought you were the one
        Listening to my heart instead of my head
        You found another one, but
        I am the better one
        I won't let you forget me
        I still see your shadows in my room
        Can't take back the love that I gave you
        It's to the point where I love and I hate you
        And I cannot change you so I must replace you (oh)
        Easier said than done
        I thought you were the one
        Listening to my heart instead of my head
        You found another one, but
        I am the better one
        I won't let you forget me
      `,
    },
  },
}
</script>

<style lang="scss" scoped>
.the-lyrics {
  font-weight: 600;
  width: 100%;
  padding: 20px;
  font-size: 2em;
  text-align: center;
  line-height: 3em;
  letter-spacing: .015em;
  display: flex;
  align-items: center;
  flex-flow: row;
  height: 100vh;
  background: linear-gradient(
    180deg,
    transparent 10%,
    #fff 40%,
    #fff 60%,
    transparent 90%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  p {
    max-height: 100vh;
    height: auto;
  }
}
</style>
