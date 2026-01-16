import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "ap-southeast-2" });

export const handler = async (event) => {
  const body = JSON.parse(event.body ?? "{}");

  const item = {
    orderId: "ORD-" + Date.now(),
    nama: body.nama,
    hewan: body.hewan,
    produk: body.produk,
    jumlah: body.jumlah,
    status: "Menunggu",
    createdAt: new Date().toISOString()
  };

  await client.send(
    new PutCommand({
      TableName: "db-pet-shop",
      Item: item
    })
  );

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(item)
  };
};
