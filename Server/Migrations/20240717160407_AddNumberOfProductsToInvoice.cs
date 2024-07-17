using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Stock_Management_System.Migrations
{
    /// <inheritdoc />
    public partial class AddNumberOfProductsToInvoice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NumberOfProducts",
                table: "Invoices",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumberOfProducts",
                table: "Invoices");
        }
    }
}
