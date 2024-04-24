/** @type {import('next').NextConfig} */
const nextConfig = {
	redirects: async () => {
		return [
			{
				source: '/',
				destination: '/explore',
				permanent: true,
			},
		];
	},
};

export default nextConfig;
