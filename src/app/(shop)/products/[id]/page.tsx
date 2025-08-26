interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div>
      <h1>Product {params.id}</h1>
      <p>Product detail page coming soon...</p>
    </div>
  );
}