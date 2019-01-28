import { transform } from "@babel/core";
import ora from 'ora';
import rm from 'rimraf';
import mkdirp from 'mkdirp';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

const spinner = ora( 'compiling source...' );

spinner.start()

rm( path.join( __dirname, '..', 'dist' ), err => {
	if ( err ) {
		spinner.stop();
		throw err;
	}

	fs.readFile( path.resolve( path.join( __dirname, '..', 'index.js' ) ), ( err, code ) => {
		transform( code, ( err, result ) => {
			if ( err ) {
				spinner.stop();
				throw err;
			}

			var outputPath = path.join( __dirname, '..', 'dist' );
			mkdirp( outputPath, function ( err ) {
				if ( err ) {
					spinner.stop();
					throw err;
				}

				fs.writeFile( path.join( outputPath, 'index.js' ) , result.code, function( err ) {
					if ( err ) {
						spinner.stop();
						throw err;
					}

					spinner.stop();
					console.log( chalk.green( '  Build complete.\n ') );
				});
			});

		} );
	} );

} );


