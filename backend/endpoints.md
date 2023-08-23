# End Points for the Server


## Deleting File

Rob this is the endpoint for deleting a Bridge deal file:
https://www.brianbridge.net/cgi-bin/brian2delhandrecordxml.cgi

There is one get argument, SLOT, which should be the account name the deal file is to be deleted from:
....?SLOT=robtestingaccount

There is no POST data.

The response is text-xml. The main thing to look at in the response is the sf attribute of the root element - if this is sf="s" then the deal file was successfully uploaded. If sf="f", it wasn't, and look at the attribute for an error message.

There are also sub-elements `<hrevtxt />`,` <hands />` and `<handanxs />` in the response which you can throw away. These should in principle be empty, if they even exist.


## Uploading Bridge deal file
Rob this is the endpoint for uploading a Bridge deal file:
https://www.brianbridge.net/cgi-bin/brian2puthandrecordxml.cgi

There is one get argument, SLOT, which should be the account name the deal file is for:
....?SLOT=robtestingaccount

The POST payload is form-data, in plain text. There are two form fields, "diasel" which should always be 1, and the "upload" which is the file itself.

The response is text-xml. The main thing to look at in the response is the sf attribute of the root element - if this is sf="s" then the deal file was successfully uploaded. If sf="f", it wasn't, and look at the attribute for an error message.

There are also sub-elements `<hrevtxt />`, `<hands />` and `<handanxs />` in the response which you can throw away - they basically contain the data that was uploaded (if successful).

## Pianola File GET

Rob this is the endpoint for donwloading a Pianola file:

https://www.brianbridge.net/cgi-bin/brian2getfile.cgi

There are three GET arguments:
SLOT, the account name for which to download the Pianola file
TYPE always equal to EBUP2PXML (for the moment, until we start implementing e.g. Australian Master Points)
NOWRAP always equal to the string TRUE

The POST payload is form-data, in plain text.There is only one form field, "postdatapassedbyform". Each line is a different parameter:

Line 1 : The name of the Bridge Club\
Line 2 : The national ID code of the bridge club\
Line 3 : The name of the bridge event\
Line 4 : The "charge code" for master pointing. For England, you can find a list of possible values here: https://www.ebu.co.uk/documents/universal-membership/player-session-rates.pdf\
Line 5 : Y or N , depending on whether Master Points are to be issued (note capitalization)\
Line 6 : A string with the colour of the master points issued. In England, Black , Green, Red or Gold (note capitalization)\
Line 7 : A string with the scale of the master points issued. In England, Club, Regional, or about eight other options. Can just allow 'Club' for the moment (note capitalization)\
Line 8 : The name of the TD for the session\
Line 9 : The email of the TD for the session\
Line 10 : Not used I think\
Line 11 : y or n , depending on whether Master Points should be issued per match won (note small caps)

There seem to be about 12 more trailing lines, I'm not sure if they're for anything but you might as well replicate them.

Many of these fields can be left blank but the ones you use must all be on the right line. You can see how the existing form works by logging into brianbridge.net and clicking Upload/Download->EBU P2P - strongly advise you take a look, it's eye-opening

If successful, the response is text-xml. If unsuccessful the response is text/plain, and Status 400.

