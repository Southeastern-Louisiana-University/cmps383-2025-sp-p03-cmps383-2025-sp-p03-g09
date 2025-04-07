using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    /// <inheritdoc />
    public partial class SeatsUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TicketId",
                table: "Orders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_TicketId",
                table: "Orders",
                column: "TicketId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Tickets_TicketId",
                table: "Orders",
                column: "TicketId",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Tickets_TicketId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_TicketId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "TicketId",
                table: "Orders");

        }
    }
}
