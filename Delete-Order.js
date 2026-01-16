import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "ap-southeast-2" });

export const handler = async (event) => {
  const { orderId } = event.pathParameters || {};

  if (!orderId) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        { value: event.pathParameters || {} })
    };
  }

  await client.send(
    new DeleteCommand({
      TableName: "db-pet-shop",
      Key: { orderId }
    })
  );

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ message: "Pesanan berhasil dihapus" })
  };
};
