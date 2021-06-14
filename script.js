const root = document.documentElement;
const postForm = document.getElementById("post-form");
const midSection = document.getElementById("section-middle");

const nav = document.querySelector(".nav");
const boxSection = document.querySelector(".status-box");
const popUp = document.querySelector(".status-popup");

const secs = document.querySelectorAll(".sec");

const btnMore = `
    <div class="status-popup hidden">
      <span class="share"><a href="#">share</a></span>
      <span class="edit"><a href="#">edit</a></span>
      <span class="delete"><a href="#">delete</a></span>
      <span class="privacy"><a href="#">privacy</a></span>
      <span class="report"><a href="#">report</a></span>
    </div>`;


const deleteBox=`<div class="delete-box">
<h3>DELETE</h3>
<p class="delete-content">you are about to delete this post, do you want to continue?</p>
<p class="delete-dialog">
  <span><a href="#">delete</a></span>
  <span><a href="#">cancel</a></span>
</p>
</div>`

function cb(e) {
  e.preventDefault();
  const [[, post]] = Array.from(new FormData(this));
  // const { post } = Object.fromEntries(new FormData(this));
  if (!post) return;

  const status = `        <div class="status-box">
  <div class="status-info">
    <img src="./img/IMG_sam_3234353.jpg" alt="" class="user-image" />
    <p>
      <span class="username">oduwole samuel</span
      ><span class="date">22 min.</span>
    </p>
    <span>⭐</span>
  </div>
  <p class="status-content">
   ${post}
  </p>
  <p class="status-content-dialog">
    <span class="status-like"
      ><a href="#">likes</a><span> 99+</span></span
    >
    <span class="status-comment"
      ><a href="#">comments</a><span> 9</span></span
    >
    <span class="status-more"><a href="#">more</a></span>
  </p>
</div>`;

  // const p = document.createElement("p");
  // p.textContent = post;

  this.insertAdjacentHTML("afterend", status);
  Array.from(this.children).forEach((obj) =>
    ["post"].includes(obj.name) ? (obj.value = "") : undefined
  );

  // status?.removeEventListener("submit", cb);
}

// function navCb(entries, observer) {
//   entries.forEach((entry) => {
//     if (!entry.isIntersecting) return;
//     entry.target.style.position = "sticky";
//     entry.target.style.top = 0;
//   });
// }

function secCb(entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const section = entry.target.parentNode;
    const navHeight = section.previousElementSibling.getBoundingClientRect()
      .height;
    const sectionPad = Number.parseFloat(
      getComputedStyle(section).marginTop,
      10
    );

    entry.target.style.position = "sticky";
    entry.target.style.top = sectionPad + navHeight + "px";
  });
}

// const navObserver = new IntersectionObserver(navCb);
// navObserver.observe(nav);

const secObserver = new IntersectionObserver(secCb);
secs.forEach((s) => secObserver.observe(s));

postForm?.addEventListener("submit", cb);

root?.addEventListener("click", function (e) {
  if (
    !document.querySelector(".status-popup") &&
    !e.target.closest(".status-more")
  )
    return;

  if (
    document.querySelector(".status-popup") &&
    !["share", "edit", "delete", "privacy", "report"].some((cl) =>
      e.target.closest("." + cl)
    )
  )
    document.querySelector(".status-popup").remove();

  e.preventDefault();

  if (e.target.closest(".status-more"))
    e.target.closest(".status-more").insertAdjacentHTML("beforebegin", btnMore);  
  

  if (
    ["share", "edit", "privacy", "report"].some((cl) =>
      e.target.closest("." + cl)
    )
  ) {
    console.log(e.target.closest("span"));
    document.querySelector(".status-popup").remove();

  }

  if(e.target.closest(".delete")){
    e.target.closest(".status-box").style.display="none" 
    e.target.closest(".status-box")?.insertAdjacentHTML("afterend",deleteBox)
    document.querySelector(".status-popup").remove();
  }


});
