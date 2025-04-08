using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    /// <inheritdoc />
    public partial class CorrectPurchaseTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.Sql(@"
        IF NOT EXISTS (
            SELECT * FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'Orders' AND COLUMN_NAME = 'PurchaseTime'
        )
        BEGIN
            ALTER TABLE Orders
            ADD PurchaseTime datetime2 NOT NULL DEFAULT('2000-01-01T00:00:00');
        END
    ");
}

protected override void Down(MigrationBuilder migrationBuilder)
{
    migrationBuilder.Sql(@"
        IF EXISTS (
            SELECT * FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'Orders' AND COLUMN_NAME = 'PurchaseTime'
        )
        BEGIN
            ALTER TABLE Orders DROP COLUMN PurchaseTime;
        END
    ");
}
    }
}
