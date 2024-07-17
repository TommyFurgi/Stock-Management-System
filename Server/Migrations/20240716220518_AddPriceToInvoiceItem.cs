using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Stock_Management_System.Migrations
{
    /// <inheritdoc />
    public partial class AddPriceToInvoiceItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "InvoiceItems",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "InvoiceItems");
        }
    }
}
