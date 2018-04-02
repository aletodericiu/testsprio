package utils;

import domain.FaultMatrix;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class FileHandling {

    public static FaultMatrix readMatrix(String fileName) throws FileNotFoundException {
        Scanner input = new Scanner(new File(fileName));
        // pre-read in the number of rows/columns
        int rows = 0;
        int columns = 0;
        int elements = 0;
        while (input.hasNextLine()) {
            ++rows;
            Scanner colReader = new Scanner(input.nextLine());
            while (colReader.hasNextByte()) {
                ++elements;
                colReader.next();
            }
        }
        columns=elements/rows;

        byte[][] a = new byte[rows][columns];

        input.close();

        // read in the data
        input = new Scanner(new File(fileName));
        for (int i = 0; i < rows; ++i) {
            for (int j = 0; j < columns; ++j) {
                if (input.hasNextByte()) {
                    a[i][j] = input.nextByte();
                }
            }
        }
        FaultMatrix faultMatrix = new FaultMatrix(columns, rows, a);
        return faultMatrix;
    }
}
