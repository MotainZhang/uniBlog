import marked from 'marked'
import xss from 'xss'
import hljs from 'highlight.js'
// 转化 md 语法为 html
export const translateMarkdown = (plainText, isGuardXss = false) => {
  return marked(isGuardXss ? xss(plainText) : plainText, {
    renderer: new marked.Renderer(),
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: true,
    highlight: function(code) {
      /*eslint no-undef: "off"*/
      return hljs.highlightAuto(code).value
    }
  })
}
// 计算 评论数
export const calcCommentsCount = commentList => {
  let count = commentList.length
  commentList.forEach(item => {
    count += item.replies.length
  })
  return count
}