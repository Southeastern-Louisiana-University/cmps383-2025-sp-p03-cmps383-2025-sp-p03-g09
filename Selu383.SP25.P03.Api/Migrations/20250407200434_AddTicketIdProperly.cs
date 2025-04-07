using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTicketIdProperly : Migration
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

                // TEMP: Remove broken rows before applying FK
                migrationBuilder.Sql(@"
                    DELETE FROM OrderFoodItems;
                    DELETE FROM Payments;
                    DELETE FROM Orders
                    WHERE TicketId IS NULL
                    OR TicketId NOT IN (SELECT Id FROM Tickets);
                ");

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
                    onDelete: ReferentialAction.Cascade); // or Cascade

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
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Tickets_TicketId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_TicketId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "PurchaseTime",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "TicketId",
                table: "Orders");
        }
    }
}
