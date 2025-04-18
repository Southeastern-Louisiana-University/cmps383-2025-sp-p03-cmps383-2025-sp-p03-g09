using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    /// <inheritdoc />
    public partial class FixFoodQuantity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderFoodItems",
                table: "OrderFoodItems");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "OrderFoodItems",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderFoodItems",
                table: "OrderFoodItems",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_OrderFoodItems_OrderId",
                table: "OrderFoodItems",
                column: "OrderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_OrderFoodItems",
                table: "OrderFoodItems");

            migrationBuilder.DropIndex(
                name: "IX_OrderFoodItems_OrderId",
                table: "OrderFoodItems");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "OrderFoodItems");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OrderFoodItems",
                table: "OrderFoodItems",
                columns: new[] { "OrderId", "FoodItemId" });
        }
    }
}
