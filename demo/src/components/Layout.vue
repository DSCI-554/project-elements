<template>
<div class="wrapper">
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <b-navbar-brand href="/">Elements</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="align-items-center ml-auto ml-md-0">
        <b-nav-item href="/dashboard">Dashboard</b-nav-item>
        <b-nav-item href="/map">Map</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <div class="content">
    <transition name="move" mode="out-in"><router-view></router-view></transition>
  </div>
</div>

</template>

<script>

// import { FadeTransition } from 'vue2-transitions'
export default {

}
</script>
<style>



</style>