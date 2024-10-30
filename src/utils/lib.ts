import type { Article, ArticleInsert } from "../types/article"
import type { Feedback, FeedbackInsert } from "../types/feedback"
import type { MenuInsert } from "../types/menu"
import type { Post, PostInsert } from "../types/post"
import type { Slide, SlideInsert } from "../types/slide"
import type { InsertUserType, User } from "../types/user"

export const convertDataUserToUserInsert = (post: User): InsertUserType => {
  return {
    name: post.name || "",
    email: post.email || "",
    phone: post.phone || "",
    password: post.password,
  }
}
export const convertDataPostToPostInsert = (post: Post): PostInsert => {
  return {
    title: post.title,
    desc: post.desc || "",
    content: post.content || "",
    show: post.show,
    hot: post.hot,
    priority: post.priority || 0,
    menus: post.menus ? post.menus.toString() : "", // Kiểm tra null/undefined
    keywords: post.keywords || "",
    thumb: post.thumb || null,
    // thumb: null,
  }
}

export const convertDataFeedbackToFeedbackInsert = (
  feedback: Feedback,
): FeedbackInsert => {
  return {
    avatar: feedback.avatar || null,
    // avatar: null,
    name: feedback.name,
    star: feedback.star,
    content: feedback.content,
    url: feedback.url ? String(feedback.url) : null,
    show: feedback.show,
    priority: feedback.priority || 0,
  }
}

export const convertDataSlideToSlideInsert = (slide: Slide): SlideInsert => {
  return {
    image: slide.image || null,
    // image: null,
    title: slide.title,
    target: slide.target,
    desc: slide.desc,
    link: slide.link || "",
    show: slide.show,
    order: slide.order || 0,
  }
}

export const convertDataArticleToArticleInsert = (
  slide: Article,
): ArticleInsert => {
  return {
    title: slide.title,
    content: slide.content,
    desc: slide.desc,
    keywords: slide.keywords || null,
    show: slide.show,
    priority: slide.priority || 0,
  }
}

export const convertDataMenuToMenuInsert = (menu: MenuInsert): MenuInsert => {
  return {
    name: menu.name,
    inside: menu.inside,
    // thumb: post.thumb || null,
    thumb: null,

    display_type: menu.display_type,
    hot: menu.hot,
  }
}
