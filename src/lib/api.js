import axios from 'axios';
import { decodeBase64Id } from './utils';
import { mapPost } from './postapi';
import { mapCategory } from './mapCategory';

// API uç noktası
const WP_API_URL = 'https://bugunlerde.com/api/wordpress/graphql';

// Genel API Çağrı İşleyicisi
const fetchData = async (query, variables = {}) => {
  try {
    const response = await axios.post(WP_API_URL, { query, variables });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Failed to fetch data');
  }
};

// Gönderilerin listesi 
export const fetchPosts = async () => {
  const query = `
    query GetPosts {
      posts(first: 100) {
        nodes {
          id
          title
          slug
          date
          excerpt
          author {
            node {
              id
              name
              avatar {
                url
              }
            }
          }
          categories {
            nodes {
              id
              name
              slug
              parentId
              children {
                nodes {
                  id
                  name
                  slug
                }
              }
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
              title
            }
          }
        }
      }
    }
  `;

  const data = await fetchData(query); 
  return data.posts.nodes.map(mapPost);
};

///Tüm slug ları alır.
export async function getAllPostSlugs() {
  const query = `
    query {
      posts(first: 100){
        nodes {
          slug
        }
      }
    }
  `;
    const data = await fetchData(query); 
    return data.posts.nodes;
}


export async function getPostBySlug(slug) {
  const query = `
    query GetPostBySlug($slug: String!) {
      postBy(slug: $slug) {
        id
        title
        slug
        uri
        content
        date
        excerpt
        postDescription
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            id
            name
            avatar {
              url
            }
            description
          }
        }
        categories {
          nodes {
            id
            name
            slug
            parentId
            children {
              nodes {
                id
                name
                slug
              }
            }
          }
        }
      }
      posts(first: 100) {
        nodes {
          id
          title
          slug
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `;

  try {
    const data = await fetchData(query, { slug });

    const { postBy, posts } = data;

    // Find the current post's index and handle edge cases for next and previous posts
    const currentIndex = posts.nodes.findIndex((p) => p.slug === slug);
    const [previousPost, nextPost] = [
      posts.nodes[currentIndex - 1] || null,
      posts.nodes[currentIndex + 1] || null,
    ];

    // Apply mapPost function to format the current, previous, and next posts
    const formattedPost = mapPost(postBy);           // Apply mapPost to the main post
    const formattedPreviousPost = previousPost ? mapPost(previousPost) : null;  // Apply mapPost to previous post
    const formattedNextPost = nextPost ? mapPost(nextPost) : null;  // Apply mapPost to next post

    // Process categories and select the appropriate category
    const categories = postBy.categories.nodes;
    const selectedCategory = categories.find((cat) => cat.parentId) || categories[0];
    const categorySlug = selectedCategory?.slug || 'genel';

    // Extract and decode author info
    const { author } = postBy;
    const authorId = author?.node?.id ? decodeBase64Id(author.node.id) : null;

    return {
      ...formattedPost,  // Return the formatted post data
      selectedCategory,
      categorySlug,
      previousPost: formattedPreviousPost,
      nextPost: formattedNextPost,
      description: postBy.postDescription || '',
      authorId: authorId || null,
      author: author?.node?.name || 'Bilinmeyen',
      authorAvatar: author?.node?.avatar?.url || null,
      authorBio: author?.node?.description || '',
    };
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    throw new Error('Failed to fetch post by slug');
  }
}

// Fetch all categories
export const fetchCategories = async () => {
  const query = `
    query GetCategories {
      categories(where: { parent: 0 }, first: 100) {
        nodes {
          id
          name
          slug
          children {
            nodes {
              id
              name
              slug
            }
          }
        }
      }
    }
  `;

  try {
    const data = await fetchData(query);
    return data.categories.nodes.map(mapCategory);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

export const fetchPostsByCategory = async (slug) => {
  const query = `
    query GetPostsByCategory($slug: String!, $first: Int!) {
      posts(where: {categoryName: $slug}, first: $first) {
        nodes {
          id
          title
          slug
          content
          excerpt
          date
          author {
            node {
              id
              name
              avatar {
                url
              }
            }
          }
          categories {
            nodes {
              id
              name
              slug
              description
              parentId
              children {
                nodes {
                  id
                  name
                  slug
                }
              }
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
              title
            }
          }
        }
           pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  try {
    const data = await fetchData(query, { slug, first: 15 });
    return data.posts.nodes.map(mapPost);
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    throw new Error('Failed to fetch posts by category');
  }
};


export const fetchCategori = async () => {
  const query =`
    query GetCategories {
      categories(first: 100) {
        nodes {
          slug
          name
          description
        }
      }
    }
  `;

  try {
    const data = await fetchData(query);
    return data.categories.nodes.map((category) => ({
      slug: category.slug,
      name: category.name,
      description: category.description,
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};


export const fetchPostsByAuthor = async (id, cursor = null) => {
  const intId = parseInt(id, 10);

  if (isNaN(intId)) {
    throw new Error('Invalid author ID');
  }

  const query = `
    query GetPostsByAuthor($id: Int!, $first: Int!, $after: String) {
      posts(where: { author: $id }, first: $first, after: $after) {
        nodes {
          id
          title
          slug
          content
          date
          author {
            node {
              id
              name
              avatar {
                url
              }
            }
          }
          categories {
            nodes {
              id
              name
              slug
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
              title
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  `;

  try {
    const data = await fetchData(query, { id: intId, first: 12, after: cursor });

    if (data.posts.nodes) {
      return data.posts.nodes.map(mapPost); 
    } else {
      throw new Error('No posts found for this author');
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
};

export const fetchAuthors = async () => {
  const query = `
    query GetAuthors {
      users {
        nodes {
          id
          name
          slug
        }
      }
    }
  `;

  try {
    // Use the generalized fetchData function
    const data = await fetchData(query);

    // Ensure the structure is correct and map the authors
    return data.users.nodes.map(({ id, name, slug }) => ({
      id,
      name,
      slug,
    }));
  } catch (error) {
    console.error('Error fetching authors:', error);
    throw new Error('Failed to fetch authors');
  }
};

// Fetch related posts function using fetchData
export const fetchRelatedPosts = async (categorySlug, postId) => {
  const query = `
    query GetRelatedPosts($categorySlug: String!, $postId: ID!) {
      posts(where: { categoryName: $categorySlug, notIn: [$postId] }, first: 6) {
        nodes {
          id
          title
          slug
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  `;

  try {
    // Use the generalized fetchData function
    const data = await fetchData(query, { categorySlug, postId });

    // Ensure the structure is correct and map the related posts
    return data.posts.nodes.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      imageUrl: post.featuredImage?.node?.sourceUrl || null,
    }));
  } catch (error) {
    console.error('Error fetching related posts:', error);
    throw new Error('Failed to fetch related posts');
  }
};

