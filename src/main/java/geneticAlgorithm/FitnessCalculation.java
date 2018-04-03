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
                    vect[i]=cursor+1;
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
//        return 1;
    }


}
