import remarkGfm from 'remark-gfm';
import createMDX from '@next/mdx';
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  reactStrictMode: false,
  images: {
    unoptimized: true
  },
  experimental: {
    mdxRs: true
  }
};
 
const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: []
  }
});
 
export default withMDX(nextConfig);