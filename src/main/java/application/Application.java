package application;

import domain.FaultMatrix;
import geneticAlgorithm.Algorithm;
import geneticAlgorithm.FitnessCalculation;
import geneticAlgorithm.Population;
import utils.FileHandling;

import java.io.FileNotFoundException;
import java.util.logging.Logger;


public class Application {
    final static Logger LOGGER = Logger.getLogger(Application.class.getName());
    public static void main(String[] args) throws FileNotFoundException {
        LOGGER.info("hei");
        FaultMatrix faultMatrix = FileHandling.readMatrix("src/main/resources/faultMatrix.txt");
        LOGGER.info(faultMatrix.toString());
        faultMatrix.printMatrix(faultMatrix.getData(),faultMatrix.getNumberOfFaults(),faultMatrix.getNumberOfTests());

        // Set a candidate solution
        FitnessCalculation.setFaultMatrix(faultMatrix);
        Algorithm.setFaultMatrix(faultMatrix);

        // Create an initial population
        //Population myPop = new Population(UsefulMethods.factorial(faultMatrix.getNumberOfTests()), true,faultMatrix.getNumberOfTests());
        Population myPop = new Population(1000, true,faultMatrix.getNumberOfTests());
        // Evolve our population until we reach an optimum solution
        int generationCount = 0;
        while (myPop.getFittest().getFitness() < FitnessCalculation.getMaxFitness()) {
            generationCount++;
            System.out.println("Generation: " + generationCount + " Fittest: " + myPop.getFittest().getFitness());
            myPop = Algorithm.evolvePopulation(myPop);
        }
        System.out.println("Solution found!");
        System.out.println("Generation: " + generationCount);
        System.out.println("Genes:");
        System.out.println(myPop.getFittest());
        System.out.println(FitnessCalculation.calculteAPFD(myPop.getFittest()));
    }
}
