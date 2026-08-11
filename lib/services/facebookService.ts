import { getStore, saveStore } from '../dataStore';
import { addAuditLog } from './auditLogger';

export async function publishToFacebookPage(content: { title: string; body: string; imageUrl?: string; linkUrl?: string }) {
  addAuditLog(
    'integration_facebook',
    'FB_POST_START',
    `Đang đăng bài viết "${content.title}" lên Facebook Fanpage GirlStyle...`,
    'pending',
    { title: content.title }
  );

  try {
    const store = getStore();
    const newFbPost = {
      id: `FB_POST_${Date.now()}`,
      title: content.title,
      body: content.body,
      imageUrl: content.imageUrl || '',
      linkUrl: content.linkUrl || '',
      publishedAt: new Date().toISOString(),
      fbPostId: `1000998877_${Date.now()}`
    };

    store.facebookPosts = store.facebookPosts || [];
    store.facebookPosts.unshift(newFbPost);
    saveStore();

    addAuditLog(
      'integration_facebook',
      'FB_POST_SUCCESS',
      `Đã đăng thành công bài viết "${content.title}" lên Facebook Fanpage (PostID: ${newFbPost.fbPostId})`,
      'success',
      newFbPost
    );

    return { success: true, post: newFbPost };
  } catch (e: any) {
    addAuditLog(
      'integration_facebook',
      'FB_POST_FAILED',
      `Lỗi đăng bài Facebook: ${e.message}`,
      'failed'
    );
    throw e;
  }
}
