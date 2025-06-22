export const withOutSorting = (column: any) => {
    column.sortable = false;
    return column;
}