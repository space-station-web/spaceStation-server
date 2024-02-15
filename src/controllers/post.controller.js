// post.controller.js

import { response } from "../../config/response.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import * as postService from '../services/post.service.js';
import * as postDao from "../models/post.dao.js";

// 전체 글 조회
export const getPosts = async (req, res) => {
    const { orderColumn, orderDirection, limit, offset } = req.query;
    const list = await postService.getPosts({orderColumn, orderDirection, limit, offset})
    return res.send(response(status.SUCCESS, list))
}

// 글 작성
export const addPost = async (req, res, next) => {
    console.log("글 작성");
    console.log("body:", req.body);
    console.log("유저: ", req.userID); 

    if (!req.body.title) return res.send(new BaseError(status.POST_TITLE_EMPTY));
    if (!req.body.content) return res.send(new BaseError(status.POST_CONTENT_EMPTY));
    if (req.body.content.length > 65535) return res.send(new BaseError(status.POST_CONTENT_TOO_LONG));
    if (!req.body.visibility) return res.send(new BaseError(status.POST_VISIBILITY_EMPTY));
    if (req.body.visibility == "터뜨리기" && req.body.self_destructTime == null) res.send(new BaseError(status.POST_TIME_EMPTY));

    return res.send(response(status.SUCCESS, await postService.addNewPost(req.body, req.userID)));
};

// 글 삭제
export const deletePost = async (req, res, next) => {
    console.log("글 삭제");

    const { post_id } = req.params;

    return res.send(response(status.SUCCESS, await postDao.deletePost(post_id, req.userID)));
}


// 글 수정
export const editPost = async (req, res, next) => {
    console.log("글 수정");

    const { post_id } = req.params;

    if (!post_id) return res.send(new BaseError(status.POST_NOT_FOUND));
    if (!req.body.title) return res.send(new BaseError(status.POST_TITLE_EMPTY));
    if (!req.body.content) return res.send(new BaseError(status.POST_CONTENT_EMPTY));
    if (req.body.content.length > 65535) return res.send(new BaseError(status.POST_CONTENT_TOO_LONG));
    if (!req.body.visibility) return res.send(new BaseError(status.POST_VISIBILITY_EMPTY));
    if (req.body.visibility == "터뜨리기" && !req.body.self_destructTime) return res.send(new BaseError(status.POST_TIME_EMPTY));

    return res.send(response(status.SUCCESS, await postService.updatePost(post_id, req.body, req.userID)));
}

// 글 조회
export const getPost = async (req, res, next) => {
    console.log("글 조회");

    const { post_id } = req.params;

    return res.send(response(status.SUCCESS, await postDao.getPost(post_id)));
}

// 유저의 글 리스트 조회
export const getPostsByUserId = async (req, res) => {
    const { user_id } = req.params;
    const { limit, offset } = req.query;
    return res.send(response(status.SUCCESS, await postService.getPostsByUserId({limit: Number(limit), offset: Number(offset), userId: Number(user_id)})));
}

// 내 모든 이웃의 글 조회
export const getFollowPosts = async (req, res) => {
    const { userID } = req;
    // const userID = 20; // 미들웨어 사용안할 시 지정
    
    return res.send(response(status.SUCCESS, await postService.getFollowPostsByUserID(userID)))
}

// 글감 제공
export const getTopic = async (req, res, next) => {
    console.log("글감 제공");

    console.log("유저: ", req.userID);

    return res.send(response(status.SUCCESS, await postDao.getRandomTopic(req.userID)));
}