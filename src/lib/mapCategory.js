export const mapCategory = (category) => {
    return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        children: category.children.nodes.map((subCategory) => ({
          id: subCategory.id,
          name: subCategory.name,
          slug: subCategory.slug,
      })),
    };
  };
  