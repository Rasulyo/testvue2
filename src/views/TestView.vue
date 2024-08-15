<template>
  <div class="wrapper">
    <div class="top-section">
      <div class="selected-user-items">
        <h3>Selected User Items</h3>
        <ul>
          <li v-for="item in selectedUserItems" :key="item.id">
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="selected-available-item">
        <h3>Selected Available Item</h3>
        <p v-if="selectedAvailableItem">{{ selectedAvailableItem.name }}</p>
      </div>
    </div>
    <div class="bottom-section">
      <div class="user-items">
        <h3>User Items</h3>
        <ul>
          <li
            v-for="item in userItems"
            :key="item.id"
            @click="selectUserItem(item)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="available-items">
        <h3>Available Items</h3>
        <ul>
          <li
            v-for="item in availableItems"
            :key="item.id"
            @click="selectAvailableItem(item)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters([
      "getUserItems",
      "getAvailableItems",
      "getSelectedUserItems",
      "getSelectedAvailableItem",
    ]),
    userItems() {
      return this.getUserItems;
    },
    availableItems() {
      return this.getAvailableItems;
    },
    selectedUserItems() {
      return this.getSelectedUserItems;
    },
    selectedAvailableItem() {
      return this.getSelectedAvailableItem;
    },
  },
  methods: {
    ...mapActions(["selectUserItem", "selectAvailableItem"]),
  },
};
</script>

<style lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
}

.top-section,
.bottom-section {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
}

.top-section > div,
.bottom-section > div {
  width: 45%;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 8px;
  margin: 5px 0;
  background-color: #ddd;
  cursor: pointer;
}

li:hover {
  background-color: #ccc;
}
</style>
