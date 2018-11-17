import controllerGenerator from './controllerGenerator';
import daoGenerator from "../dao/daoGenerator";
import dbConnection from '../resources/dbConnection';

let connection = dbConnection.promise();

const CONTROLLERS = [

    controllerGenerator('location')(daoGenerator('location','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('location/tag')(daoGenerator('location_tag','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('location/tag/map')(daoGenerator('location_tag_map',null,null,connection)),
    controllerGenerator('person/name')(daoGenerator('person_name','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('person')(daoGenerator('person','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('patient')(daoGenerator('patient','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('obs')(daoGenerator('obs','uuid',['date_created'],connection)),
    controllerGenerator('concept')(daoGenerator('concept','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('concept/answer')(daoGenerator('concept_answer','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('concept/attribute')(daoGenerator('concept_attribute','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('concept/attribute/type')(daoGenerator('concept_attribute_type','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('concept/class')(daoGenerator('concept_class','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('concept/complex')(daoGenerator('concept_complex','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('concept/datatype')(daoGenerator('concept_datatype','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('concept/description')(daoGenerator('concept_description','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('concept/map/type')(daoGenerator('concept_map_type','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('concept/name')(daoGenerator('concept_name','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('concept/name/tag')(daoGenerator('concept_name_tag','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('concept/name/tag/map')(daoGenerator('concept_name_tag_map','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('concept/numeric')(daoGenerator('concept_numeric','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('concept/proposal')(daoGenerator('concept_proposal','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('concept/proposal/tag/map')(daoGenerator('concept_proposal_map','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('concept/reference/map')(daoGenerator('concept_reference_map','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('concept/reference/source')(daoGenerator('concept_reference_source','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('concept/reference/term')(daoGenerator('concept_reference_term','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('concept/reference/term/map')(daoGenerator('concept_reference_term_map','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('concept/set')(daoGenerator('concept_set','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('concept/state/conversion')(daoGenerator('concept_state_conversion','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('concept/stop/word')(daoGenerator('concept_stop_word','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('conditions')(daoGenerator('conditions','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('drug')(daoGenerator('drug','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('drug/ingredient')(daoGenerator('drug_ingredient','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('drug/order')(daoGenerator('drug_order','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('drug/reference/map')(daoGenerator('drug_reference_map','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('encounter')(daoGenerator('encounter','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('encounter/provider')(daoGenerator('encounter_provider','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('encounter/role')(daoGenerator('encounter_role','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('encounter/type')(daoGenerator('encounter_type','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('field')(daoGenerator('field','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('field/answer')(daoGenerator('field_answer','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('field/type')(daoGenerator('field_type','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('user')(daoGenerator('users','uuid',['date_created','date_changed'],connection)),
    controllerGenerator('provider')(daoGenerator('provider','uuid',['date_created','date_changed'],connection))
      
];

export {CONTROLLERS}