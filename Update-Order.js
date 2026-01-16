import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "ap-southeast-2" });

export const handler = async (event) => {
  const { orderId } = event.pathParameters || {};
  const body = JSON.parse(event.body ?? "{}");

  if (!orderId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "orderId wajib ada" })
    };
  }

  const updates = [];
  const values = {};
  const names = {};

  if (body.status) {
    updates.push("#status = :status");
    names["#status"] = "status";
    values[":status"] = body.status;
  }

  if (body.jumlah !== undefined) {
    updates.push("jumlah = :jumlah");
    values[":jumlah"] = body.jumlah;
  }

  if (updates.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Tidak ada field yang diupdate" })
    };
  }

  await client.send(
    new UpdateCommand({
      TableName: "db-pet-shop",
      Key: { orderId },
      UpdateExpression: "SET " + updates.join(", "),
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values
    })
  );

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ message: "Pesanan berhasil diperbarui" })
  };
};
