import { format, addDays, eachDay, isThursday } from 'date-fns'
import input from 'input';
import exceljs from 'exceljs';
import fs from 'fs';
import path from 'path';
import os from 'os';

const PERIOD_LENGTH = 7;
const USER_DEFAULTS_PATH = path.join( os.homedir() + '/.roborfc' );

async function askStuff() {

	// setting up

	const userDefaults = JSON.parse ( fs.readFileSync( USER_DEFAULTS_PATH, { encoding: 'utf8' } ) );
	const defaults = Object.assign( {
		role: 'Arquitectura y Soluciones',
		deployHour: '22:00 hrs',
		instalationTime: '20',
		verificationTime: '20',
		rollbackTime: '20',
		noConflict: 'No hay impacto',
		priotity: 'Baja'
	}, userDefaults );

	console.log( defaults );

	// Applicant

	const name = await input.text( 'Your name:' );
	const email = await input.text( 'Your email:' );
	const role = await input.select( 'Your role:', [
		'Arquitectura y Soluciones', 'Soporte TI', 'Infraestructura TI'
	], { default: 'Arquitectura y Soluciones' } );
	const phone = await input.text( 'Phone number:', { default: 'N/A' } );

	// Client

	const clientName = await input.text( 'Client name:' );
	const clientEmail = await input.text( 'Client email:' );

	// Project

	const projectName = await input.text( 'Project name:' );
	const deployDate = await input.select( 'Deploy date:', getDeployDates( new Date() ).map(
		date => format( date.toString(), 'dddd, MMMM DD, YYYY' ) ) );
	const deployHour = await input.text( 'Deploy hour (24 hours):', { default: '22:00 hrs' } );
	const instalationTime = await input.text( 'Instalation time (minutes):', { default: '20' } );
	const verificationTime = await input.text( 'Verification time (minutes):', { default: '20' } );
	const rollbackTime = await input.text( 'Rollback time (minutes):', { default: '20' } );
	const noConflict = await input.select( 'Was it validated that the deploy doesn\'t impact the users functional process?', [ 'No hay impacto', 'Si hay impacto' ] );
	const priotity = await input.select( 'Priority', [ 'Baja', 'Mediana', 'Alta' ], { default: 'Baja' } );

	// Justification


}

function findNextThursday( today ) {
	let week = eachDay( today, addDays( today, PERIOD_LENGTH ) );
	return week.filter( isThursday ).pop();
}

function* deployDateGenerator( startDate, step ) {
	let start = new Date( startDate.getTime() );
	while( true ){
		start = addDays( start, step );
		yield start;
	}
}

function getDeployDates( today ) {
	let nextThursday = findNextThursday( today );
	let deployDates = [ nextThursday ];
	let thursdaysGenerator = deployDateGenerator( nextThursday, PERIOD_LENGTH );
	for( let i=0; i<3; i++ ){
		deployDates.push( thursdaysGenerator.next().value );
	}

	return deployDates;
}

askStuff();