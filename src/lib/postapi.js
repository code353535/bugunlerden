import { decodeBase64Id } from './utils';

  export const mapPost = (post) => {
    let selectedCategory = null;
    if (post.categories?.nodes?.length > 0) {
      selectedCategory = post.categories.nodes.find((cat) => cat.parentId) || post.categories.nodes[0];
    }
  
    const categorySlug = selectedCategory ? selectedCategory.slug : 'genel';
    const authorId = post.author?.node?.id ? decodeBase64Id(post.author.node.id) : null;
    const categoryDescription = selectedCategory ? selectedCategory.description : 'Açıklama mevcut değil';
  
    // Determine the next post in the list
  const nextPost = index < posts.length - 1 ? posts[index + 1] : null;

  // Determine the previous post in the list
  const previousPost = index > 0 ? posts[index - 1] : null;

    return {
      ...post,
      imageUrl: post.featuredImage?.node?.sourceUrl || null,
      altText: post.featuredImage?.node?.altText || '',
      imageTitle: post.featuredImage?.node?.title || '',
      authorId,
      author: post.author?.node?.name || 'Bilinmeyen',
      authorAvatar: post.author?.node?.avatar?.url || null,
      categorydesc: categoryDescription,
      category: selectedCategory ? selectedCategory.name : 'Genel',
      categorySlug,
      nextPost: nextPost ? mapPost(nextPost, index + 1, posts) : null, // Recursively map the next post
      previousPost: previousPost ? mapPost(previousPost, index - 1, posts) : null, // Recursively map the previous post
    };
  };
  