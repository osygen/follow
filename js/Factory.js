export default class Factory {
  _popUp;

  #statusTemplate = `
  <div class="status-box topMarginAnimation">
    <div class="status-info" data-user-idstatus-id="{{statusId}}">
      <div class="user-image-box">
        <img src="./img/IMG_sam_3234353.jpg" alt="" class="user-image" />
      </div>
      <p>
        <span class="username">oduwole samuel</span>
        <span class="date">⏲ 22 min.</span>&nbsp;<span>📌</span>
      </p>
      <span>⭐</span>
    </div>
    <a href="./panel.html"><p class="status-content">{{post}}<span style="background-color:green"> ...read more</span></p></a>
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

  #comPlyTemp = `
  <div class="comment topMarginAnimation" data-user-idstatus-id="{{statusId}}">
    <div class="status-info">
      <p>
        <span class="username">Samuel Oduwole</span>
        <span class="date">0 min. | edited</span>
      </p>
    </div>
    <div class="status-imgInfo">
      <div class="user-image-box">
        <img
          src="./img/IMG_sam_3234353.jpg"
          alt=""
          class="user-image"
        />
      </div>
      <a href="#" ><p class="com-ply-content">
        {{post}}<span class="read-more"></span>
      </p></a>
    </div>
    <div class="comment-dialog">
      <button class="reply">reply</button>&nbsp;&nbsp;<button
        class="edit"
      >
        edit</button
      >&nbsp;&nbsp;<button class="delete">delete</button>
    </div>
  </div>`;

  #comPlyFormTemp = `<form id="com-ply" class="translateandscaley">
  <textarea id="{{comment}}" name="{{comment}}" type="text" placeholder="write a {{comment}}" ></textarea>
  <input type="submit" value="post" />
</form>`;

  constructor() {
    setInterval(() => (this.statusId = parseInt(Date.now())), 1000);
    console.log(this._comPlyForm("reply"));
    this._comPlyForm();
  }

  _formData(et) {
    return new FormData(et);
  }

  _statusHandler(post) {
    const temp = document.createElement("temp");

    if (post.post) {
      const tempStamp = (post.post.split(" ").length >= 150
        ? this.#statusTemplate
        : this.#statusTemplate.replace(
            '<span style="background-color:green"> ...read more</span>',
            ""
          )
      ).replace("{{statusId}}", this.statusId);

      temp.innerHTML = tempStamp;

      temp.querySelector(".status-content").childNodes[0].nodeValue =
        post.post.split(" ").length >= 151
          ? post.post.split(" ").slice(0, 150).join(" ")
          : post.post;

      return temp.children[0];
    }

    if (post.comment) {
      const tempStamp = (post.comment.split(" ").length >= 250
        ? this.#comPlyTemp
        : this.#comPlyTemp.replace('<span class="read-more"></span>', "")
      ).replace("{{statusId}}", this.statusId);

      temp.innerHTML = tempStamp;

      temp.querySelector(".com-ply-content").childNodes[0].nodeValue =
        post.comment.split(" ").length >= 250
          ? post.comment.split(" ").slice(0, 250).join(" ")
          : post.comment;

      return temp.children[0];
    }

    // if (post.reply) return ;
  }

  _comPlyForm(tempStr = "comment") {
    if (tempStr !== "comment" && tempStr !== "reply") {
      return console.error(
        "parameter is " + tempStr,
        "pls use comment or reply as the parameter"
      );
    }

    return this.#comPlyFormTemp.replaceAll("{{comment}}", tempStr);
  }
}