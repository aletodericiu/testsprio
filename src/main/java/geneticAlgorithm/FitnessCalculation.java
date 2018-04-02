package geneticAlgorithm;

import domain.FaultMatrix;

public class FitnessCalculation {

//    static byte[] solution = new byte[64];
    static int nrTests;
    static FaultMatrix faultMatrix;
    static int[] genes = new int[nrTests];

    public static void setFaultMatrix(FaultMatrix faultMatrix) {
        FitnessCalculation.faultMatrix = faultMatrix;
    }

    /* Public methods */
    // Set a candidate solution as a byte array
//    public static void setSolution(byte[] newSolution) {
//        solution = newSolution;
//    }

    // To make it easier we can use this method to set our candidate solution
    // with string of 0s and 1s
//    static void setSolution(String newSolution) {
//        solution = new byte[newSolution.length()];
//        // Loop through each character of our string and save it in our byte
//        // array
//        for (int i = 0; i < newSolution.length(); i++) {
//            String character = newSolution.substring(i, i + 1);
//            if (character.contains("0") || character.contains("1")) {
//                solution[i] = Byte.parseByte(character);
//            } else {
//                solution[i] = 0;
//            }
//        }
//    }

    // Calculate inidividuals fittness by comparing it to our candidate solution
//    static int getFitness(Individual individual) {
//        int fitness = 0;
//        // Loop through our individuals genes and compare them to our cadidates
//        for (int i = 0; i < individual.size() && i < solution.length; i++) {
//            if (individual.getGene(i) == solution[i]) {
//                fitness++;
//            }
//        }
//        return fitness;
//    }

    public static double calculteAPFD(Individual individual){
        int[] data = individual.getGenes();
        int[] vect= new int[faultMatrix.getNumberOfFaults()];
        Integer cursor=0;
        Boolean notFound=false;
        for (Integer i=0;i<faultMatrix.getNumberOfFaults();i++){
            cursor=0;
            notFound=false;
            while ((!notFound)&&(cursor<data.length)) {
                if (faultMatrix.getElementFromIndexes(data[cursor], i) == 1) {
                    vect[i]=data[cursor]+1;
                    notFound=true;
                    cursor=0;
                }else{
                    cursor++;
                }
            }
        }
        int sum=0;
        for (Integer i=0;i<vect.length;i++){
            sum+=vect[i];
        }
        double result = (1-((double)sum/(faultMatrix.getNumberOfFaults()*faultMatrix.getNumberOfTests()))+((double)1/(2*faultMatrix.getNumberOfTests())));
        return result;
    }

    // Get optimum fitness
    public static double getMaxFitness() {
        Individual individual=new Individual();
        individual.setGenes(genes);
        individual.setNrTests(nrTests);
        return calculteAPFD(individual);
    }


}
