<template>
  <div class="now-playing">
    <div class="now-playing__text">
      <template v-if="hasInfo">
        <span v-if="artist">
          {{ artist }}
        </span>
        <span v-if="title">
          {{ title }}
        </span>
      </template>
      <span v-else>
        {{ placeholder }}
      </span>
    </div>
    <note/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import note from '@/assets/note.svg'

export default {
  components: {
    note,
  },
  data () {
    return {
      placeholder: 'Nothing playing',
    }
  },
  computed: {
    ...mapState({
      track: state => state.playback.track,
    }),
    title () {
      return this.track.title
    },
    artist () {
      return this.track.artist
    },
    thumbnail () {
      return this.track.thumbnail
    },
    hasInfo () {
      return this.track.title || this.track.artist
    },
  },
}
</script>

<style lang="scss" scoped>
.now-playing {
  position: relative;
  cursor: pointer;
  display: block;
  font-size: 1.4em;
  border-radius: 2.6em;
  user-select: none;
  overflow: hidden;
  font-weight: 500;
  display: flex;
  height: 2.6em;
  align-items: center;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  max-width: 2.6em;
  transition: max-width .25s ease-out;

  &__text {
    margin-left: 2.5em;
    margin-left: 2.5em;
    margin-right: .8em;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    opacity: 0;
    transition: opacity .25s;
  }

  &__thumbnail {
    position: absolute;
    left: 0;
    width: 2.6em;
    border-radius: 2.6em;
  }

  svg {
    position: absolute;
    left: .47em;
    top: .4em;
    height: 1.7em;
    fill: $font-color;
  }

  span:nth-child(2):before {
    content: '-';
  }

  &:before {
    content: '';
    opacity: .5;
    position: absolute;
    z-index: -2;
    background: $accent-color;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    transition: opacity .1s;
  }

  &:hover {
    max-width: calc(100vw - 20px - 1em);
    transition: max-width .15s ease-out;

    .now-playing__text {
      opacity: 1;
    }
    &:before {
      opacity: .75;
    }
  }

  @media only screen and (min-width: 640px) {
    max-width: 50vw;
    &__text {
      opacity: 1;
    }
  }
}
</style>
