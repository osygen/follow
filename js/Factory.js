export default class Factory {
  _popUp;

  #statusTemplate = `
  <div class="status-box">
    <div class="status-info">
      <div class="user-image-box">
        <img src="./img/IMG_sam_3234353.jpg" alt="" class="user-image" />
      </div>
      <p>
        <span class="username">oduwole samuel</span>
        <span class="date">⏲ 22 min.</span>&nbsp;<span>📌</span>
      </p>
      <span>⭐</span>
    </div>
    <p class="status-content">{{post}}</p>
    <p class="status-content-dialog">
      <span class="status-like">
        <a href="#">likes</a>
        <span> 99+</span>
      </span>
      <span class="status-comment">
        <a href="#">comments</a>
        <span> 9</span>
      </span>
      <span class="status-more">
        <a href="#">more</a>
      </span>
    </p>
  </div>`;

  _formData(et) {
    return new FormData(et);
  }

  _statusHandler(post) {
    return Object.keys(post)
      .map((p) => this.#statusTemplate.replace("{{post}}", post[p]))
      .join(" ");
  }
}
