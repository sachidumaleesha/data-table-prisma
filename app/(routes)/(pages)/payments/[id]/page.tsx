export default async function PaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <h1>Payment Detail Page</h1>
      <p>Payment ID: {id}</p>
    </div>
  );
}
