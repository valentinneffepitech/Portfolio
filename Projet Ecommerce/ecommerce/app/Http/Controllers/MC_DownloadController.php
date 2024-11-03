<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Collection;

/**
 * Class MC_DownloadController
 *
 * For downloading database tables in CSV format.
 */
class MC_DownloadController extends Controller
{
    /**
     * Get data from a database table and download it in CSV format.
     *
     * @param string $table Table name.
     * @return \Illuminate\Http\Response
     *
     * @SWG\Get(
     *     path="/download/{table}",
     *     summary="Download database table as CSV",
     *     tags={"Download"},
     *     @SWG\Parameter(
     *         name="table",
     *         in="path",
     *         type="string",
     *         required=true,
     *         description="Table name"
     *     ),
     *     @SWG\Response(
     *         response=200,
     *         description="CSV file download",
     *     ),
     *     @SWG\Response(
     *         response=404,
     *         description="Table not found"
     *     )
     * )
     */
    public function downloadTable($table)
{
    switch ($table) {
        case 'cards':
            $tableData = DB::table('cards')
            ->join('users', 'cards.user_id', '=', 'users.id')
            ->select('cards.*', 'users.name', 'users.email')
            ->get();
            break;

        case 'users':
            $tableData = DB::table('users')->get();
            break;

        case 'deliveries':
            $tableData = DB::table('delivery_content')
            ->join('deliveries', 'delivery_content.delivery_id', '=', 'deliveries.id')
            ->join('items', 'delivery_content.item_id', '=', 'items.id')
            ->select('deliveries.*', 'items.*')
            ->get();
            break;

        case 'items':
            $tableData = DB::table('items')
            ->join('has_been_visiteds', 'has_been_visiteds.item_id', '=', 'items.id')
            ->select('has_been_visiteds.hasBeenSeen', 'items.*')
            ->get();
            break;

        default:
            return response()->json(['message' => 'Soit cette table n\'existe pas, soit vous n\'avez pas l\'autorisation de la télécharger !'], 403);
            break;
    }

    // Transform the collection to CSV format
    $csvData = $this->convertToCsv($tableData);

    // Set up the response
    $response = Response::make($csvData);
    $response->header('Content-Type', 'text/csv');
    $response->header('Content-Disposition', "attachment; filename=$table.csv");

    return $response;
}

    /**
     * Convert data to CSV format.
     *
     * @param array $data Data to convert.
     * @return string CSV data.
     *
     * @SWG\Definition(
     *     definition="CsvData",
     *     type="string",
     * )
     */
    protected function convertToCsv($data)
    {
        $output = fopen('php://temp', 'w');

        // Add column headers as the first row
        if (!empty($data)) {
            fputcsv($output, array_keys((array) $data[0]));
        }

        foreach ($data as $row) {
            fputcsv($output, (array) $row);
        }

        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);

        return $csv;
    }
}
