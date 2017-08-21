<template>
  <div>
    <input type="number" v-model="scoreFilterLimit">
    <div class="ticket row" v-for="article in scoreFilter(articles)">
      <div class="col-md-3">
        {{ article.date }}
      </div>
      <div class="col-md-6">
        <a v-bind:href="article.link">{{ article.title }} {{ article.score}}</a>
      </div>
      <div class="col-md-3">
        <button 
          v-on:click="scorePost(article.id, 2)" 
          class="btn"
          v-bind:class="{ 'btn-primary': article.preference == 2}"
          >+2</button>
        <button 
          v-on:click="scorePost(article.id, 1)" 
          class="btn"
          v-bind:class="{ 'btn-primary': article.preference == 1 }"
          >+1</button>
        <button 
          v-on:click="scorePost(article.id, -1)"
          class="btn"
          v-bind:class="{ 'btn-primary': article.preference == -1 }"
          >-1</button>
        <button 
          v-on:click="scorePost(article.id, -2)" 
          class="btn"
          v-bind:class="{ 'btn-primary': article.preference == -2 }"
          >-2</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      articles: [],
      scoreFilterLimit: 0,
    }
  },
  mounted: function() {
    this.update()
  },
  methods: {
    update: function () {
      this.$http.get('/api/v1/articles').then((response) => {
        // success callback
        this.articles = response.body;
      }, (response) => {
        // error callback
        this.articles = [];
      });
    },
      scoreFilter: function(articles) {
        self = this
        return articles.filter(function(o) {
          return o.score > self.scoreFilterLimit
        })
    },
    scorePost: function(id, score) {
      this.$http.put('/api/v1/articles/' + id, {score: score}).then((response) => {
        var idx = this.articles.map(function(x, i) {return [x, i]}).filter(function(o) { return o[0].id == id; })[0][1]
        this.articles[idx].preference = response.body.preference
      })
    }
  }
}
</script>
