package geneticAlgorithm;

import domain.FaultMatrix;

public class Algorithm {
    /* GA parameters */
    private static final double uniformRate = 0.5;
    private static final double mutationRate = 0.015;
    private static final int tournamentSize = 5;
    private static final boolean elitism = true;
    private static FaultMatrix faultMatrix;

    public static void setFaultMatrix(FaultMatrix faultMatrix) {
        Algorithm.faultMatrix = faultMatrix;
    }

    /* Public methods */

    // Evolve a population
    public static Population evolvePopulation(Population pop) {
        Population newPopulation = new Population(pop.size(), false, faultMatrix.getNumberOfTests());

        // Keep our best individual
        if (elitism) {
            newPopulation.saveIndividual(0, pop.getFittest());
        }

        // Crossover population
        int elitismOffset;
        if (elitism) {
            elitismOffset = 1;
        } else {
            elitismOffset = 0;
        }
        // Loop over the population size and create new individuals with
        // crossover
        for (int i = elitismOffset; i < pop.size(); i++) {
            Individual indiv1 = tournamentSelection(pop);
            Individual indiv2 = tournamentSelection(pop);
            Individual newIndiv = crossover(indiv1, indiv2);
            newPopulation.saveIndividual(i, newIndiv);
        }

        // Mutate population
        for (int i = elitismOffset; i < newPopulation.size(); i++) {
            mutate(newPopulation.getIndividual(i));
        }

        return newPopulation;
    }

    // Crossover individuals
    private static Individual crossover(Individual indiv1, Individual indiv2) {
        Individual newSol = new Individual(faultMatrix.getNumberOfTests());
//        // Loop through genes
//        for (int i = 0; i < indiv1.size(); i++) {
//            // Crossover
//            if (Math.random() <= uniformRate) {
//                newSol.setGene(i, indiv1.getGene(i));
//            } else {
//                newSol.setGene(i, indiv2.getGene(i));
//            }
//        }
//        return newSol;
        int[] genes1=indiv1.getGenes();
        int[] genes2=indiv2.getGenes();
        int i=0;
        int[] firstHalfFromFirstIndiv=new int[genes1.length/2];
        int contor=0;
        while (contor<genes2.length){
            if (isGenerated(firstHalfFromFirstIndiv,genes2[contor])){
                contor++;
            }
            else{
                newSol.setGene(i,genes2[contor]);
                i++;
                contor++;
            }
        }
        int j=0;
        while (j<firstHalfFromFirstIndiv.length){
            newSol.setGene(i,firstHalfFromFirstIndiv[j]);
            j++;
            i++;
        }
        return newSol;
    }

    private static Boolean isGenerated(int[] data, int x){
        int nrZ=0;
        int i=0;
        while (i<data.length&&nrZ<2){
            if (x==data[i]&&x!=0){
                return true;
            }
            else if (x==0){
                nrZ++;
                i++;
            }
            i++;
        }
        if (i == data.length&&nrZ==1){
            return false;
        }
        return false;
    }

    // Mutate an individual
    private static void mutate(Individual indiv) {
        // Loop through genes
//        for (int i = 0; i < indiv.size(); i++) {
//            if (Math.random() <= mutationRate) {
//                // Create random gene
//                int gene = (int)(Math.random() * ((indiv.getNrTests()-1) + 1));
//                indiv.setGene(i, gene);
//            }
//        }
        Boolean swapped=false;
        int position1 = (int)(Math.random() * ((faultMatrix.getNumberOfTests()-1) + 1));
        int position2 = (int)(Math.random() * ((faultMatrix.getNumberOfTests()-1) + 1));
        while (!swapped) {
            if (position1 != position2) {
                int elemaux=indiv.getGene(position1);
                indiv.setGene(position1,indiv.getGene(position2));
                indiv.setGene(position2,elemaux);
                swapped=true;
            }
            else{
                position2 = (int)(Math.random() * ((faultMatrix.getNumberOfTests()-1) + 1));
            }
        }
    }

    // Select individuals for crossover
    private static Individual tournamentSelection(Population pop) {
        // Create a tournament population
        Population tournament = new Population(tournamentSize, false,faultMatrix.getNumberOfTests());
        // For each place in the tournament get a random individual
        for (int i = 0; i < tournamentSize; i++) {
            int randomId = (int) (Math.random() * pop.size());
            tournament.saveIndividual(i, pop.getIndividual(randomId));
        }
        // Get the fittest
        Individual fittest = tournament.getFittest();
        return fittest;
    }

}
