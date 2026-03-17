type ProductDetails = {
	id: number;
	name: string;
	description: string;
	price: number;
	stock: number;
};

const CATALOG_SERVICE_URL =
	process.env.CATALOG_SERVICE_URL || "http://localhost:8000/catalog";

export const GetProductDetails = async (
	productId: number,
): Promise<ProductDetails> => {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 5000);

	try {
		const response = await fetch(
			`${CATALOG_SERVICE_URL}/products/${productId}`,
			{
				method: "GET",
				headers: { Accept: "application/json" },
				signal: controller.signal,
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch product: ${response.status}`);
		}

		const product = (await response.json()) as ProductDetails;
		return product;
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError") {
			throw new Error("Catalog service request timed out");
		}
		throw error;
	} finally {
		clearTimeout(timeout);
	}
};