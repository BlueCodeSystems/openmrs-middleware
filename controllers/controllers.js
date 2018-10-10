import controllerGenerator from './controllerGenerator';
import daoGenerator from "../dao/daoGenerator";
import dbConnection from '../resources/dbConnection';

let connection = dbConnection.promise();

const CONTROLLERS = [

    controllerGenerator('location')(daoGenerator('location','uuid',connection)),
    controllerGenerator('person/name')(daoGenerator('person_name','uuid',connection)),
    controllerGenerator('person')(daoGenerator('person','uuid',connection)),
    controllerGenerator('patient')(daoGenerator('patient','uuid',connection)),
    controllerGenerator('obs')(daoGenerator('obs','uuid',connection)),
    controllerGenerator('concept')(daoGenerator('concept','uuid',connection)),
    controllerGenerator('concept/answer')(daoGenerator('concept_answer','uuid',connection)),
    controllerGenerator('concept/attribute')(daoGenerator('concept_attribute','uuid',connection)),
    controllerGenerator('concept/attribute/type')(daoGenerator('concept_attribute_type','uuid',connection)),
    controllerGenerator('concept/class')(daoGenerator('concept_class','uuid',connection)),
    controllerGenerator('concept/complex')(daoGenerator('concept_complex','uuid',connection)),
    controllerGenerator('concept/datatype')(daoGenerator('concept_datatype','uuid',connection)),
    controllerGenerator('concept/description')(daoGenerator('concept_description','uuid',connection)),
    controllerGenerator('concept/map/type')(daoGenerator('concept_map_type','uuid',connection)),
    controllerGenerator('concept/name')(daoGenerator('concept_name','uuid',connection)),
    controllerGenerator('concept/name/tag')(daoGenerator('concept_name_tag','uuid',connection)),
    controllerGenerator('concept/name/tag/map')(daoGenerator('concept_name_tag_map','uuid',connection)),
    controllerGenerator('concept/numeric')(daoGenerator('concept_numeric','uuid',connection)),
    controllerGenerator('concept/proposal')(daoGenerator('concept_proposal','uuid',connection)),
    controllerGenerator('concept/proposal/tag/map')(daoGenerator('concept_proposal_map','uuid',connection)),
    controllerGenerator('concept/reference/map')(daoGenerator('concept_reference_map','uuid',connection)),
    controllerGenerator('concept/reference/source')(daoGenerator('concept_reference_source','uuid',connection)),
    controllerGenerator('concept/reference/term')(daoGenerator('concept_reference_term','uuid',connection)),
    controllerGenerator('concept/reference/term/map')(daoGenerator('concept_reference_term_map','uuid',connection)),
    controllerGenerator('concept/set')(daoGenerator('concept_set','uuid',connection)),
    controllerGenerator('concept/state/conversion')(daoGenerator('concept_state_conversion','uuid',connection)),
    controllerGenerator('concept/stop/word')(daoGenerator('concept_stop_word','uuid',connection)),
    controllerGenerator('conditions')(daoGenerator('conditions','uuid',connection)),
    controllerGenerator('drug')(daoGenerator('drug','uuid',connection)),
    controllerGenerator('drug/ingredient')(daoGenerator('drug_ingredient','uuid',connection)),
    controllerGenerator('drug/order')(daoGenerator('drug_order','uuid',connection)),
    controllerGenerator('drug/reference/map')(daoGenerator('drug_reference_map','uuid',connection)),
    controllerGenerator('encounter')(daoGenerator('encounter','uuid',connection)),
    controllerGenerator('encounter/provider')(daoGenerator('encounter_provider','uuid',connection)),
    controllerGenerator('encounter/role')(daoGenerator('encounter_role','uuid',connection)),
    controllerGenerator('encounter/type')(daoGenerator('encounter_type','uuid',connection)),
    controllerGenerator('field')(daoGenerator('field','uuid',connection)),
    controllerGenerator('field/answer')(daoGenerator('field_answer','uuid',connection)),
    controllerGenerator('field/type')(daoGenerator('field_type','uuid',connection))
      
];

export {CONTROLLERS}