using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    /// <inheritdoc />
    public partial class PurchaseTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "PurchaseTime",
                table: "Orders",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(2000, 1, 1));


        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PurchaseTime",
                table: "Orders");migrationBuilder.DropColumn(
                name: "PurchaseTime",
                table: "Orders");


        }
    }
}
