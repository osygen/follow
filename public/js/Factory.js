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
    <a href="./panel.html"><p class="status-content">{{post}}<span class="read-more"></span></p></a>
    <p class="status-content-dialog">
      <a class="status-like" href="./friends">
      <svg>
        <use xlink:href="./css/sprite.svg#icon-thumbs-up"></use>
      </svg>
      &nbsp;<span>99+</span>
    </a>
    <a class="status-comment" href="#">
      <svg>
        <use  xlink:href="./css/sprite.svg#icon-bubble2"></use>
      </svg>
      &nbsp;<span>99454</span>
    </a>
    <a class="status-more" href="#">
      <svg>
        <use xlink:href="./css/sprite.svg#icon-menu"></use>
      </svg>
    </a>
    </p>
  </div>`;

  #comPlyTemp = `<div class="comment topMarginAnimation" data-user-idstatus-id="{{statusId}}">
                  <div class="status-info">
                    <p>
                      <span class="username">Samuel Oduwole</span>
                      <span class="replies">99+ replies</span>&nbsp;&bull;&nbsp;
                      <span class="edited">edited</span>&nbsp;&bull;&nbsp;
                      <span class="date">0 min.</span>
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
                    <button class="reply">reply</button><button class="delete">delete</button>
                  </div>
                </div>`;

  #comPlyFormTemp = `<form id="com-ply" class="translateandscaley">
                      <textarea id="{{comment}}" name="{{comment}}" type="text" placeholder="write a {{comment}}" ></textarea>
                      <input type="submit" value="{{comment}}" />
                    </form>`;

  constructor() {
    setInterval(() => (this.statusId = parseInt(Date.now())), 1000);
  }

  _formData(et) {
    return new FormData(et);
  }

  _statusHandler(post) {
    const temp = document.createElement("temp");

    if (post.post) {
      const tempStamp = (post.post.split(" ").length >= 150
        ? this.#statusTemplate
        : this.#statusTemplate.replace('<span class="read-more"></span>', "")
      ).replace("{{statusId}}", this.statusId);

      temp.innerHTML = tempStamp;

      temp.querySelector(
        ".status-content"
      ).childNodes[0].nodeValue = post.post.split(" ").slice(0, 150).join(" ");

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

    if (post.reply) return post;
  }

  _comPlyForm(tempStr = "comment") {
    if (tempStr !== "comment" && tempStr !== "reply") {
      return console.error(
        `invalid parameter: "${tempStr}", pls use 'comment' or 'reply' as the parameter`
      );
    }

    const t = this.#comPlyFormTemp.replaceAll("{{comment}}", tempStr);

    return tempStr === "comment"
      ? t
      : t.replace("translateandscaley", "scaleAnimation");
  }

  _removeAnimation(animationName, timeOut) {
    setTimeout(
      (a) => document.querySelector(a)?.classList.remove(a.slice(1)),
      timeOut,
      animationName
    );
  }

  domString(p) {
    // alert(p);
    return p === "#about"
      ? `<form action="" id="about-form">
    <fieldset>
      <div id="about_list">
        <!-- user info -->

        <div class="about_list_item">
          <h1 class="about_heading">user info</h1>
          <input type="checkbox" id="about-user-info" checked />
          <label for="about-user-info">
            <svg class="icon icon-caret" style="fill: #444">
              <use xlink:href="./css/sprite.svg#icon-caret"></use>
            </svg>
          </label>

          <div class="about-content">
            <input type="checkbox" id="edit-about-content" />
            <label for="edit-about-content"></label>

            <fieldset disabled>
              <ul class="info-list">
                <li>
                  <label for="username"> username</label>&nbsp;
                  <input
                    type="text"
                    name="first-name"
                    value="osygen"
                    id="username"
                    required
                  />
                </li>

                <li>
                  <label for="first-name"> first name</label>&nbsp;
                  <input
                    type="text"
                    name="first-name"
                    value="samuel"
                    id="first-name"
                    required
                  />
                </li>
              </ul>
            </fieldset>
          </div>
        </div>

        <!-- basic info -->

        <div class="about_list_item">
          <h1 class="about_heading">basic info</h1>
          <input type="checkbox" id="about-basic-info" checked />
          <label for="about-basic-info">
            <svg class="icon icon-caret" style="fill: #444">
              <use xlink:href="./css/sprite.svg#icon-caret"></use>
            </svg>
          </label>

          <div class="about-content">
            <input type="checkbox" id="edit-about-content-1" />
            <label for="edit-about-content-1"></label>
            <fieldset disabled>
              <ul class="info-list">
                <li>
                  <label for="dob"> birthday</label>&nbsp;
                  <input
                    type="date"
                    name="dob"
                    value="2021-07-09"
                    id="dob"
                  />
                </li>
              </ul>
            </fieldset>
          </div>
        </div>

        <!-- links -->

        <div class="about_list_item">
          <h1 class="about_heading">links</h1>
          <input type="checkbox" id="about-links" checked />
          <label for="about-links">
            <svg class="icon icon-caret" style="fill: #444">
              <use xlink:href="./css/sprite.svg#icon-caret"></use>
            </svg>
          </label>

          <div class="about-content">
            <input type="checkbox" id="edit-about-content-2" />
            <label for="edit-about-content-2"></label>
            <fieldset disabled>
              <ul class="info-list">
                <li>
                  <select>
                    <option value="skype">skype</option>
                    <option value="facebook">facebook</option>
                    <option value="twitter">twitter</option>
                    <option value="instagram">instagram</option>
                    <option value="linkedIn">linkedIn</option>
                  </select>
                  <input type="text" name="skype" value="osygen" />
                  <svg style="width: 1.5rem; height: 1.5rem; fill: tomato">
                    <use
                      xlink:href="./css/sprite.svg#icon-unfollow-minus"
                    ></use>
                  </svg>

                  <svg
                    style="width: 1.5rem; height: 1.5rem; fill: limegreen"
                  >
                    <use
                      xlink:href="./css/sprite.svg#icon-follow-add"
                    ></use>
                  </svg>
                </li>
              </ul>
            </fieldset>
          </div>
        </div>

        <div class="about_list_item">
          <h1 class="about_heading">skills</h1>
          <input type="checkbox" id="about-skills" checked />
          <label for="about-skills">
            <svg class="icon icon-caret" style="fill: #444">
              <use xlink:href="./css/sprite.svg#icon-caret"></use>
            </svg>
          </label>

          <div class="about-content">
            <input type="checkbox" id="edit-about-content-3" />
            <label for="edit-about-content-3"></label>
            <fieldset disabled>
              <ul class="info-list"></ul>
            </fieldset>
          </div>
        </div>
      </div>

      <fieldset
        style="
          border: none;

          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 2rem;
        "
      >
        <div
          style="
            position: relative;

            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            border: 1px solid #555;
            background-color: transparent;
          "
        >
          <svg class="icon" style="fill: #999">
            <use xlink:href="./css/sprite.svg#icon-unlock"></use>
          </svg>
        </div>

        <button
          type="submit"
          style="
            align-self: flex-end;
            margin-top: auto;
            padding: 1rem 2.5rem;
            width: 20%;
            border-radius: 2rem;
            border: none;
            outline: none;
          "
        >
          submit
        </button>
      </fieldset>
    </fieldset>
  </form>`
      : p;
  }
}
