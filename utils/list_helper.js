const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs[4];
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const authorCounts = {};
  blogs.forEach((blog) => {
    authorCounts[blog.author] = (authorCounts[blog.author] || 0) + 1;
  });

  const topAuthor = Object.keys(authorCounts).reduce((a, b) =>
    authorCounts[a] > authorCounts[b] ? a : b
  );

  return { author: topAuthor, blogs: authorCounts[topAuthor] };
};

const mostLikes = (blogs) => {
  const maxUser = blogs.reduce((acc, blog) => {
    return blog.likes > acc.likes ? blog : acc;
  });
  return { author: maxUser.author, likes: maxUser.likes };
};

module.exports = { dummy, totalLikes, mostBlogs, mostLikes };
